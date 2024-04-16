import styles from "./Cards.module.css"

export const CardInfo = {
    nipes: ["♣️", "♠️", "♥️", "♦️"],
    values: ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"],
    colors: ["r", "b"]
}

export type Card = {
    value: string //"A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K"
    nipe: string //"♣️" | "♠️" | "♥️" | "♦️"
    color: string //"r" | "b"
    reveal: revealType
}

export type Deck = {
    cards: Array<Card>
}
/**
 * Create a Deck of cards
 * @param num number of decks to be created
 * @returns A deck with deck in it
 */
export function getDeck(num: number = 1): Card[] {
    var deck: Card[] = []
    for (let i = 0; i < num; i++) {
        CardInfo.nipes.forEach(n => {
            CardInfo.values.forEach(v => {
                var card: Card = {
                    value: v,
                    nipe: n,
                    color: n === "♣️" || n === "♠️" ? "b" : "r",
                    reveal: revealType.HIDDEN
                }
                deck.push(card)
            })
        })
    }
    return deck
}

function getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
}


/**
 * Shuffle's the card in the given deck
 * @param deck Deck to be shuffled 
 * @returns A copy of the original deck, but shuffled
 */
export function shuffle(deck: Card[]): Card[] {
    var shuffled_deck: Card[] = []
    var cards: Card[] = [...deck]
    while (cards.length !== 0) {
        var num: number = getRandomInt(cards.length)
        shuffled_deck.push(cards[num])
        cards.splice(num, 1)
    }
    return shuffled_deck
}

/**
 * Divide the given Deck to multiples parts setted by `num`.
 * The last pack may not have the same quantity compare to the others if `num` is not a divisor of total of cards 
 * @param deck deck to divide into packs
 * @param num max number of cards in a pack (default = 52) 
 * @returns Array of decks containing the divided packs
 */
export function divideDeck(deck: Deck, num: number = 52): Array<Deck> {
    var decks: Array<Deck> = []
    while (deck.cards.length !== 0) {
        var new_deck: Deck = { cards: deck.cards.splice(0, num > deck.cards.length ? deck.cards.length : num) }
        decks.push(new_deck)
    }
    return decks
}

/**
 * Divide a single pack from the original deck setted by `num`.
 * If the deck don't have sufficient cards to divide, the pack gains the max amount possible.
 * @param deck deck to remove a pack
 * @param num number of cards to create a new pack
 * @returns Array of decks → [ given deck, new pack formed ]
 */
export function createPack(deck: Card[], num: number): Array<Card[]> {
    var decks: Array<Card[]> = []
    var new_pack: Card[] = deck.splice(0, num > deck.length ? deck.length : num)
    var new_deck: Card[] = deck.splice(0, deck.length)
    decks.push(new_deck)
    decks.push(new_pack)
    return decks
}

export function getIndex(card: Card) {
    return CardInfo.values.indexOf(card.value)
}

export enum revealType {
    SHOW,
    HIDDEN,
    EMPTY
}

type CardElementProps = {
    card: Card,
    reveal: revealType
    onClick?: () => void
    empty_nipe?: string
    selected: boolean
    translate?: number
}


export const CardElement = (props: CardElementProps) => {
    const translateStyles = { transform: `translateY(-${props.translate || 0}%)`, }

    const colorStyle = props.card && props.card.color === "r" ? { color: "#be1931" } : { color: "black" }
    
    var cardClasses = `${styles.card} ${props.selected && styles.selected}`
    
    switch (props.reveal) {
        case revealType.EMPTY:
            cardClasses += ` ${styles.empty}`
            break
        case revealType.HIDDEN:
            cardClasses += ` ${styles.reverse}`
    }

    return (
        <div className={cardClasses} onClick={props.onClick} style={translateStyles}>
            {props.reveal === revealType.SHOW && (
                <>
                    <div className={styles.cardBeginLabel}>
                        <label className={styles.cardLabel} style={colorStyle}>{props.card.value}</label>
                        <label className={styles.cardLabelNipe} style={colorStyle}>{props.card.nipe}</label>
                    </div>
                    <label className={styles.cardLabelMiddle} style={colorStyle}>{props.card.nipe}</label>
                    <div className={styles.cardLabelEnd + " " + styles.rotated}>
                        <label className={styles.cardLabel} style={colorStyle}>{props.card.value}</label>
                        <label className={styles.cardLabelNipe} style={colorStyle}>{props.card.nipe}</label>
                    </div>
                </>
            )}

            {props.reveal === revealType.EMPTY &&
                <label className={styles.cardLabelMiddle}>{props.empty_nipe === undefined ? "O" : props.empty_nipe}</label>

            }
            
            {props.reveal === revealType.HIDDEN &&
                <label className={styles.cardLabelMiddle}>🌀</label>

            }
        </div>
    )
}
